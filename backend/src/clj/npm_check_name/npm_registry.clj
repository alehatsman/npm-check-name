(ns npm-check-name.npm-registry
  (:require [org.httpkit.client :as http]))

(def NPM_REGISTRY "https://registry.npmjs.org/")

(defn resolve-url [name]
  (str NPM_REGISTRY name))

(defn check-package-name [name cb]
  (http/get (resolve-url name) nil 
            (fn [{:keys [status error]}]
              (cb {:error error
                   :result (= status 404)}))))
