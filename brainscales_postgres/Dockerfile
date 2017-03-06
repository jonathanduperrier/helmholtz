# vim:set ft=dockerfile:
FROM debian:jessie

# explicitly set user/group IDs
RUN groupadd -r postgres --gid=999 && useradd -r -g postgres --uid=999 postgres

# grab gosu for easy step-down from root
ENV GOSU_VERSION 1.10
RUN set -x \
	&& apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
	&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
	&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
	&& gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
	&& rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu \
	&& gosu nobody true \
	&& apt-get purge -y --auto-remove ca-certificates wget

# make the "en_US.UTF-8" locale so postgres will be utf-8 enabled by default
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
	&& localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8

ENV PG_MAJOR 9.6
ENV PG_VERSION 9.6.2-1.pgdg80+1

RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main' $PG_MAJOR > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update \
	&& apt-get install -y postgresql-common \
	&& sed -ri 's/#(create_main_cluster) .*$/\1 = false/' /etc/postgresql-common/createcluster.conf \
	&& apt-get install -y \
		postgresql-$PG_MAJOR=$PG_VERSION \
		postgresql-contrib-$PG_MAJOR=$PG_VERSION \
	&& rm -rf /var/lib/apt/lists/*

# make the sample config easier to munge (and "correct by default")
RUN mv -v /usr/share/postgresql/$PG_MAJOR/postgresql.conf.sample /usr/share/postgresql/ \
	&& ln -sv ../postgresql.conf.sample /usr/share/postgresql/$PG_MAJOR/ \
	&& sed -ri "s!^#?(listen_addresses)\s*=\s*\S+.*!\1 = '*'!" /usr/share/postgresql/postgresql.conf.sample

ENV PATH /usr/lib/postgresql/$PG_MAJOR/bin:$PATH
ENV PGDATA /var/lib/postgresql/$PG_MAJOR/main
VOLUME /var/lib/postgresql/data

RUN pg_createcluster $PG_MAJOR main --start

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
#RUN echo "host all  all    0.0.0.0/0  trust\n" \
#	"host all  all    127.0.0.1/32  trust" \

#RUN echo "host postgres  all    127.0.0.1/32  ident sameuser"	>> /etc/postgresql/$PG_MAJOR/main/pg_hba.conf

RUN echo "listen_addresses='*'" >> /var/lib/postgresql/$PG_MAJOR/main/postgresql.conf

ADD pg_hba.conf /etc/postgresql/$PG_MAJOR/main/
RUN cp /etc/postgresql/$PG_MAJOR/main/pg_hba.conf /var/lib/postgresql/$PG_MAJOR/main/pg_hba.conf

USER postgres
RUN /etc/init.d/postgresql start &&\
    sleep 60 &&\
    psql -h localhost --command "CREATE USER brainscales WITH PASSWORD 'pwd_brainscales_5f6f3d';"  &&\
    psql --command "CREATE ROLE root SUPERUSER;"  &&\
		psql --command "GRANT ROOT TO brainscales;"  &&\
		psql --command "ALTER ROLE brainscales WITH LOGIN;"  &&\

		psql --command "CREATE DATABASE brainscales_db;"  &&\
		psql --command "GRANT ALL PRIVILEGES ON DATABASE brainscales_db TO root;"  &&\
		psql --command "GRANT ALL PRIVILEGES ON DATABASE brainscales_db TO brainscales;" &&\
		psql --command "SHOW data_directory;"

EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME	["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

#RUN cat /etc/postgresql/$PG_MAJOR/main/pg_hba.conf
#RUN more /etc/postgresql/$PG_MAJOR/main/postgresql.conf

CMD ["postgres"]
