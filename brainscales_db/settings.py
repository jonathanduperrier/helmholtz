# Django settings for brainscales_db project.
import os
PROJ_DIR = os.path.dirname(__file__)
#BASE_DIR = os.path.dirname(PROJ_DIR)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

from os.path import dirname, join, abspath
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(name):
    try:
        return os.environ[name]
    except KeyError:
        error_msg = "Set the %s env variable!" % name
        raise ImproperlyConfigured(error_msg)

DEBUG = True
TEMPLATE_DEBUG = DEBUG

PROJECT_ROOT = abspath(join(abspath(dirname(__file__)), "..", ".."))

ADMINS = (
    ('jonathan', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'brainscales_db',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'brainscales',
        #'USER': 'root',
        'PASSWORD': 'pwd_brainscales_5f6f3d',
        #'PASSWORD': 'toto',
        'HOST': '172.17.2.70',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',                      # Set to empty string for default.
    }
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
#TIME_ZONE = 'America/Chicago'
TIME_ZONE = 'UTC'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = join(PROJECT_ROOT, "media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/


STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'data')
MEDIA_URL = '/data/'

# Tastypie
TASTYPIE_DEFAULT_FORMATS = [ 'json', 'jsonp', 'xml', 'yaml' ]
TASTYPIE_ALLOW_MISSING_SLASH = True
API_LIMIT_PER_PAGE = 0

# Guardian
AUTHENTICATION_BACKENDS = {
    'django.contrib.auth.backends.ModelBackend',  # this is the default
    'guardian.backends.ObjectPermissionBackend',
}
ANONYMOUS_USER_ID = -1

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, "templates"),
)

IN_DOCKER = True
if IN_DOCKER:
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')
else:
   STATICFILES_DIRS = (
       os.path.join(BASE_DIR, "static"),
   )

LOGIN_URL = "/login/"


# Make this unique, and don't share it with anybody.
SECRET_KEY = 'l6f=27t3_bepmg)ajt#%=la7k(n$o50c%hf6luz2$0o=*5r0a!'
#SECRET_KEY = get_env_variable('DJANGO_SECRET_KEY')

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django.contrib.auth.middleware.SessionAuthenticationMiddleware',#
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    'django.middleware.clickjacking.XFrameOptionsMiddleware',#
    # CORS
    'helmholtz.middleware.crossdomainxhr.XsSharing',
)

ROOT_URLCONF = 'brainscales_db.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'brainscales_db.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    join(PROJECT_ROOT, "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    # HELMHOLTZ APPS - in order of dependency
    'helmholtz.core',
    'helmholtz.people',
    'helmholtz.species',
    'helmholtz.units',
    'helmholtz.storage',
    'helmholtz.measurements',
    'helmholtz.neuralstructures',
    'helmholtz.chemistry',
    'helmholtz.locations',
    'helmholtz.devices',
    'helmholtz.stimulations',
    'helmholtz.preparations',
    'helmholtz.experiments',
    'helmholtz.drugs',
    'helmholtz.recordings',
    'helmholtz.analysis',
    'helmholtz.notebooks',
    # THIRD-PARTY APPS
    'tastypie',
    'guardian',
)

# THIRD-PARTY
# tastypie
# to add jsonp, used in cross-site requests
TASTYPIE_DEFAULT_FORMATS = [ 'json', 'jsonp', 'xml', 'yaml' ]
TASTYPIE_ALLOW_MISSING_SLASH = True
# guardian
AUTHENTICATION_BACKENDS = {
    'django.contrib.auth.backends.ModelBackend', # this is the default
    'guardian.backends.ObjectPermissionBackend',
}
ANONYMOUS_USER_ID = -1

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
