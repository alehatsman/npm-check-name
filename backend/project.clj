(defproject npm_check_name "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  
  :main npm-check-name.main

  :dependencies [[org.clojure/clojure "1.8.0"]
                
                 ; Logging dependencies
                 [org.clojure/tools.logging "0.3.1"]
                 [log4j/log4j "1.2.17"]
                 [org.slf4j/slf4j-log4j12 "1.7.9"]

                 ; Http dependencies
                 [compojure "1.5.1"]
                 [ring/ring-core "1.5.0"]
                 [ring/ring-jetty-adapter "1.5.0"]
                 [ring/ring-defaults "0.2.1"]
                 [ring/ring-json "0.4.0"]
                 [ring-jetty-component "0.3.1"]
                 [metosin/ring-http-response "0.8.2"]
                 [bk/ring-gzip "0.2.1"]

                 [com.stuartsierra/component "0.3.2"]]

  :source-paths ["src/clj"]

  :profiles {:dev {:dependencies [[org.clojure/tools.namespace "0.2.11"]]
                   :source-paths ["dev"]}})
