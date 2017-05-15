(ns npm-check-name.main
  (:gen-class)
  (:require [npm-check-name.system :as system]
            [clojure.tools.logging :as log]
            [com.stuartsierra.component :as component]))

(defn -main [& args]
  (let [[app-port] args]
    (log/info ";; -main - starting app-system")
    (component/start
     (system/new-system {:http-port (or app-port 9000)}))))
