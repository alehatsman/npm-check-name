(ns npm-check-name.main
  (:gen-class)
  (:require [clojure.tools.logging :as log]
            [com.stuartsierra.component :as component]
            [npm-check-name.system :as system]
            [npm-check-name.utils :refer [get-port]]))

(defn -main [& args]
  (let [[app-port] args]
    (log/info ";; -main - starting app-system")
    (component/start
     (system/new-system {:http-port (or app-port (get-port))}))))
