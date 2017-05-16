(ns npm-check-name.routes
  (:require [ring.util.response :refer [resource-response response]]
            [ring.middleware.json :as middleware]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.component.jetty :refer [jetty-server]]
            [compojure.core :refer [defroutes routes GET POST]]
            [compojure.route :as route]
            [ring.middleware.gzip :as gzip]
            [npm-check-name.npm-registry :as registry]))

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
    (GET "/api/check-name/:name" [name] (check-package-name name))
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
  (jetty-server {:port port 
                 :app {:handler (app)}}))
