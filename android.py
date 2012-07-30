#!/usr/bin/python
# -*- coding: utf-8 -*-

import commands
import sys
import os


APP_NAME = 'app'
APP_DIR = './build/publish/'

ANDROID_DIR = './build/android/'

CORDOVA_ANDROID_CREATE = '~/Software/phonegap/lib/android/bin/create'
CORDOVA_VERSION = '2.0.0'


def _run(cmd):
    print '>> Running {0}'.format(cmd)

    (status, output) = commands.getstatusoutput(cmd)
    if status:
        sys.stderr.write(output)
        sys.exit(1)
    return (status, output)


def clean():
    print '\nCleaning up build/android'

    cmd = ' '.join(['rm -Rf', ANDROID_DIR])
    _run(cmd)


def scaffold():
    print '\nScaffolding Android build directory structure'

    cmd = ' '.join([
        'bash',
        CORDOVA_ANDROID_CREATE,
        ANDROID_DIR,
        'com.{0}'.format(APP_NAME.lower()),
        APP_NAME
    ])
    _run(cmd)


def transfer_app():
    print '\nCopying app files into android/assets/www/'

    cmd = ' '.join([
        'cp -R',
        '{0}*'.format(APP_DIR),
        '{0}assets/www/'.format(ANDROID_DIR)
    ])
    _run(cmd)


def update_index():
    print '\nUpdating index.html with cordova script reference'

    tag = '\t<script src="cordova-{0}.js"></script>\n'.format(CORDOVA_VERSION)
    index_path = '{0}assets/www/index.html'.format(ANDROID_DIR)

    with open(index_path) as f:
        index = f.read()
        eoh = index.find('</head>')  # end of head
        index = index[:eoh] + tag + index[eoh:]

    with open(index_path, 'w') as f:
        f.write(index)


def build_mobile_app():
    print '\nBuilding cordova android mobile app'

    _run('bash {0}cordova/clean'.format(ANDROID_DIR))
    _run('bash {0}cordova/debug'.format(ANDROID_DIR))


def build():
    if not os.path.exists(APP_DIR):
        print '{0} no found. Trying to build js app with grunt'.format(APP_DIR)
        _run('grunt build')

    clean()
    scaffold()
    transfer_app()
    update_index()
    build_mobile_app()


def launch():
    _run('bash {0}cordova/emulate'.format(ANDROID_DIR))


if __name__ == '__main__':

    def show_usage():
        usage = 'Usage: {0} [build] [launch]'.format(sys.argv[0])
        print usage

    argv = sys.argv[1:]
    argc = len(argv)

    if argc < 1:
        show_usage()
        sys.exit(1)

    handlers = {'build': build,
                'launch': launch}
    handlers.get(argv[0], show_usage)()
