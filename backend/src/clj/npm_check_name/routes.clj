(ns npm-check-name.routes
  (:require [clojure.core.async :refer [go]]
            [ring.util.response :refer [resource-response]]
            [ring.middleware.json :as middleware]
            [compojure.core :refer [routes GET POST]]
            [compojure.route :as route]
            [ring.middleware.gzip :as gzip]
            [org.httpkit.server :refer :all]
            [npm-check-name.http-kit-component :refer [http-kit-component]]
            [npm-check-name.npm-registry :as registry]))

(defn async-handler [handler]
  (fn [req]
    (with-channel req channel
      (go
        (handler channel)))))

(defn get-response [error result]
  (if error
    {:status 500 :body {:error error}}
    {:status 200 :body {:result result}}))

(defn check-name-handler [name]
  (async-handler
    (fn [channel]
      (if (not name) 
        (do
          (send! channel {:status 400 :body {:error "name param is required"}})
          (close channel))
        (registry/check-package-name name 
                                     (fn[{:keys [result error]}]
                                      (send! channel (get-response error result))
                                      (close channel)))))))

(defn check-package-name [name]
  (if (not name)
    {:status 400 :body {:error "name param is required"}}
    (let [{:keys [result error]} (registry/check-package-name name)]
      (if error
        {:status 500 :body {:error error}}
        {:status 200 :body {:result result}}))))

(defn app-routes 
  []
  (routes
    (GET "/" [] (resource-response "index.html" {:root "public"}))
    (GET "/api/check-name/:name" [name] (check-name-handler name))
    (route/resources "/public")
    (route/not-found "Not Found")))

(defn app
  []
  (-> (app-routes)
      (middleware/wrap-json-response)
      (middleware/wrap-json-body {:keywords? true})
      (gzip/wrap-gzip)))

(defn http-component
  [port]
  (http-kit-component (app) port))
