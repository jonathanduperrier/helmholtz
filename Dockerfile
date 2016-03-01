#
# Build an image for deploying the NMPI
#
# To build the image:
#   docker build -t visiondb_server .
#
# To run the application:
#  docker run -d -p 80 --name vdb visiondb_server
#
# If a PostgreSQL docker image is running (settings.py should be modified accordingly):
#  docker run -d -p 80 --link postgresql_nmpi:postgresql_nmpi --name nmpi_queue_server_example nmpi_queue_server
#
# To find out which port to access on the host machine, run "docker ps"
#

FROM ubuntu:14.04
MAINTAINER Andrew Davison <andrew.davison@unic.cnrs-gif.fr>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update --fix-missing

RUN apt-get install -y vim

RUN apt-get -y -q --fix-missing install nginx nginx-extras supervisor build-essential python-dev python3-dev python-setuptools python-pip sqlite3 python-psycopg2 git libxml2-dev libxslt1-dev libyaml-dev python-lxml python3-lxml libxml2 libxslt1.1
RUN unset DEBIAN_FRONTEND

RUN pip install uwsgi
RUN pip install django-tastypie

ADD . /home/docker/site

RUN pip install -r /home/docker/site/deployment/requirements.txt

WORKDIR /home/docker/site
ENV PYTHONPATH  /home/docker:/usr/local/lib/python2.7/dist-packages
ENV EMAIL_PASSWORD "omjm qhyv ztxg qlmk"

RUN if [ -f /home/docker/site/db.sqlite3 ]; then rm /home/docker/site/db.sqlite3; fi
RUN cp /home/docker/site/deployment/db.sqlite3 /home/docker/site/db.sqlite3
#RUN cp -r /home/docker/site/deployment/static/ /home/docker/site/brainscales_db/

#RUN python manage.py check
#RUN python manage.py collectstatic --noinput
#RUN python manage.py sycndb --settings=brainscales_db.settings

RUN python manage.py validate
#RUN python manage.py migrate
#RUN python manage.py syncdb
#RUN python manage.py loaddata /home/docker/site/deployment/db.json
RUN python manage.py collectstatic --noinput
RUN unset PYTHONPATH

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /home/docker/site/deployment/nginx-app.conf /etc/nginx/sites-enabled/
RUN ln -s /home/docker/site/deployment/supervisor-app.conf /etc/supervisor/conf.d/
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir /etc/nginx/ssl/
RUN ln -s /home/docker/site/deployment/ssl/nginx.key /etc/nginx/ssl/nginx.key
RUN ln -s /home/docker/site/deployment/ssl/nginx.pem /etc/nginx/ssl/nginx.pem

ENV PYTHONPATH /usr/local/lib/python2.7/dist-packages:/usr/lib/python2.7/dist-packages
EXPOSE 80
#EXPOSE 443
CMD ["supervisord", "-n"]

