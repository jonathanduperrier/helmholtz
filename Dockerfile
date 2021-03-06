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

RUN apt-get -y -q --fix-missing install nginx nginx-extras supervisor build-essential python-dev python3-dev python-setuptools python-pip sqlite3 python-psycopg2 git libxml2-dev libxslt1-dev libyaml-dev python-lxml python3-lxml libxml2 libxslt1.1 postgresql-client
RUN unset DEBIAN_FRONTEND

RUN pip install uwsgi
RUN pip install django-tastypie

ADD . /home/docker/site

RUN pip install -r /home/docker/site/deployment/requirements.txt

WORKDIR /home/docker/site
ENV PYTHONPATH  /home/docker:/usr/local/lib/python2.7/dist-packages
ENV EMAIL_PASSWORD "omjm qhyv ztxg qlmk"

RUN python manage.py validate
RUN python manage.py collectstatic --noinput
RUN python manage.py syncdb --noinput --settings=brainscales_db.settings

RUN echo "from django.contrib.auth.models import User; User.objects.create_superuser('brainscales', 'brainscales@example.com', 'pwd_brainscales_5f6f3d')" | python manage.py shell

RUN echo "from django.contrib.auth.models import User; User.objects.create_superuser('jo', 'brainscales@example.com', 'toto')" | python manage.py shell

RUN sleep 30

#insert animal
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO preparations_animal (identifier, nickname, weight, sex, birth, sacrifice) VALUES ('dd', 'dd', 10, 'M', now(), now()); "

#insert preparation
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO preparations_preparation (animal_id, type, protocol) VALUES (1, 'in vivo intra', 'default'); "

#insert people_organization (place)
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO people_organization (diminutive, name, is_data_provider) VALUES ('jd', 'jdkk666', true);"

#insert setup
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO devices_setup (label, place_id) VALUES ('jd', 1);"

#insert default type
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO devices_type (name) VALUES ('default');"

#insert researcher
RUN psql -h 172.17.0.2 -U brainscales brainscales_db --command "INSERT INTO people_researcher (user_id, phone, website, street_address, postal_code, town, country) VALUES (2, '+33648965412', 'www.gkdldk.dl', '7 rue dkldldldl', '52233', 'ddqsdqsd', 'france');"

#####

RUN unset PYTHONPATH

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /home/docker/site/deployment/nginx-app.conf /etc/nginx/sites-enabled/
RUN ln -s /home/docker/site/deployment/supervisor-app.conf /etc/supervisor/conf.d/
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /etc/nginx/ssl/brainscales.unic.cnrs-gif.fr/
RUN ln -s /home/docker/site/deployment/ssl/brainscales.unic.cnrs-gif.fr/brainscales.unic.cnrs-gif.fr.key /etc/nginx/ssl/brainscales.unic.cnrs-gif.fr/
RUN ln -s /home/docker/site/deployment/ssl/brainscales.unic.cnrs-gif.fr/brainscales.unic.cnrs-gif.fr.pem /etc/nginx/ssl/brainscales.unic.cnrs-gif.fr/

ENV PYTHONPATH /usr/local/lib/python2.7/dist-packages:/usr/lib/python2.7/dist-packages
#EXPOSE 80
EXPOSE 443
CMD ["supervisord", "-n"]
