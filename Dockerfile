FROM artifactory.euifunds.local:58081/external-container-registry/httpd:2.4.0
COPY dist/simulator-engine-frontend/browser/ /usr/local/apache2/htdocs/
COPY angular.conf /usr/local/apache2/conf/extra/angular.conf
RUN echo "Include conf/extra/angular.conf" >> /usr/local/apache2/conf/httpd.conf


