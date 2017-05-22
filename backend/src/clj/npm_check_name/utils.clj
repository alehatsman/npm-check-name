(ns npm-check-name.utils)

(defn get-port []
  (read-string (or (System/getenv "PORT") "9000")))
