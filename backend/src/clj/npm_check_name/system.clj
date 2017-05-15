(ns npm-check-name.system
  (:require [com.stuartsierra.component :as component]
            [npm-check-name.routes :refer [http-component]]))

(defn new-system [options]
  (component/system-map 
   :http (http-component (:http-port options))))
