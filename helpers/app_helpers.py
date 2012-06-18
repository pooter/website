#!/usr/bin/env python
# encoding: utf-8
"""
app_helpers.py

Created by Nick Mason on 2010-12-27.
Copyright (c) 2010 Tutt. All rights reserved.
"""

import os
import logging

from datetime import datetime
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.api import users


DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
AMAZON_S3_URL = "http://media.pooter.it.s3.amazonaws.com"                   
VIEWS_ROOT = "views/"


class helper:
    @classmethod
    def app_root(cls):
        """
        Returns the root path of the app. Not ideal to be using ../ to move up
        directories, but I can't find a better way of doing this.
        """
        return os.path.join(os.path.dirname(__file__), '../')
        
        
    @classmethod
    def template_path(cls, relative_path):
        """Returns the absolute template path for a given relative path."""
        view_path = os.path.join(VIEWS_ROOT, relative_path)
        return os.path.join(helper.app_root(), view_path)
    
    
    @classmethod
    def get_app_facebook_id(cls):
        return FACEBOOK_APP_ID


class BaseHandler(webapp.RequestHandler):
    @property
    def template_args(self):
        return { 
            "is_admin": users.is_current_user_admin(),
            "current_url": self.request.url
        }
    
    @property
    def current_user(self):
        return helper.current_player(self)


if __name__ == '__main__':
    main()

