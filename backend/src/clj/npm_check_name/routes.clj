(ns npm-check-name.routes
  (:require [ring.util.response :refer [resource-response response]]
            [ring.middleware.json :as middleware]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.component.jetty :refer [jetty-server]]
            [compojure.core :refer [defroutes routes GET POST]]
            [compojure.route :as route]
            [ring.middleware.gzip :as gzip]))

(defn app-routes 
  []
  (routes
    (GET "/" [] (resource-response "index.html" {:root "public"}))
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
