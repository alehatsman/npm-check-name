(ns npm-check-name.routes
  (:require [ring.util.response :refer [resource-response response]]
            [ring.middleware.json :as middleware]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [compojure.core :refer [defroutes routes GET POST]]
            [compojure.route :as route]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.component.jetty :refer [jetty-server]]))

(defn app-routes 
  []
  (routes
    (GET "/" [] {:status 200
                 :body {:hello "hello"}})
    (route/resources "/public")
    (route/not-found "Not Found")))

(defn app
  []
  (-> (app-routes)
      (middleware/wrap-json-response)
      (middleware/wrap-json-body {:keywords? true}) 
      ))

(defn http-component
  [port]
  (jetty-server {:port port 
                 :app {:handler (app)}}))
