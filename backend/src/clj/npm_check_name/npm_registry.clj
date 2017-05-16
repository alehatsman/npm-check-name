(ns npm-check-name.npm-registry
  (:require [org.httpkit.client :as http]))

(def NPM_REGISTRY "https://registry.npmjs.org/")

(defn resolve-url [name]
  (str NPM_REGISTRY name))

(defn check-package-name [name]
  (let [{:keys [status error]} @(http/get (resolve-url name))]
    {:error error
     :result (= status 404)}))
