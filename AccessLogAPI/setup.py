import os

if os.name == 'nt':
    pip_prefix = 'py.exe -m pip '
else:
    pip_prefix = 'pip '

os.system(pip_prefix + 'install Flask')
os.system(pip_prefix + 'install sandman')
os.system(pip_prefix + 'install ldap3')

if os.name == 'nt':
    print('Download the Psycopg2-Windows installer from http://www.stickpeople.com/projects/python/win-psycopg/ and run it. Note that this site is blocked by Websense.')
else:
    os.system(pip_prefix + 'install psycopg2')

os.system('npm install -g bower')
os.chdir('static')
os.system('bower install')
