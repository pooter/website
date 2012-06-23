import datetime
import logging

from google.appengine.ext import webapp

register = webapp.template.create_template_register()

@register.filter
def parse_date(value):
    if value is not '':
        return datetime.datetime.strptime(value, '%Y-%m-%d %H:%M:%S')