(ns npm-check-name.http-kit-component
  (:require [clojure.tools.logging :as log]
            [org.httpkit.server :as http]
            [com.stuartsierra.component :as component]))

(defrecord HttpKitComponent [handler port]
  component/Lifecycle

  (start [component]
    (log/debug ";; Starting http kit")

    (let [server (http/run-server handler {:port port})]
      (assoc component :server server)))

  (stop [component]
    (log/debug ";; Stopping http kit")

    (let [server (:server component)]
      (server :timeout 100)
      (assoc component :server nil))))

(defn http-kit-component [handler port]
  (map->HttpKitComponent {:handler handler :port port}))
