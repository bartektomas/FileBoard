# Author: Jeremy Bost
# Python version: 3.5.2
#
# Testing user signup requirement
# test_account_creation() is a success test, the others are failure tests

import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import random

url = "http://localhost/project/signup.php"

class NewUserTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.close()

    def test_incorrect_email(self):
        self.driver.get(url)

        elem = self.driver.find_element_by_name("email")
        elem.send_keys("test");

        elem = self.driver.find_element_by_name("confirmEmail")
        elem.send_keys("test");

        elem = self.driver.find_element_by_name("password")
        elem.send_keys("test");

        elem = self.driver.find_element_by_name("confirmPassword")
        elem.send_keys("test");

        elem = self.driver.find_element_by_name("createaccount")
        elem.click()

        assert "Please enter a correct email" in self.driver.page_source

    def test_emails_not_matching(self):
        self.driver.get(url)

        elem = self.driver.find_element_by_name("email")
        elem.send_keys("test@test.com");

        elem = self.driver.find_element_by_name("confirmEmail")
        elem.send_keys("test2@test.com");

        elem = self.driver.find_element_by_name("password")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("confirmPassword")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("createaccount")
        elem.click()

        assert "Your usernames or passwords do not match" in self.driver.page_source

    def test_passwords_not_matching(self):
        self.driver.get(url)

        elem = self.driver.find_element_by_name("email")
        elem.send_keys("test@test.com");

        elem = self.driver.find_element_by_name("confirmEmail")
        elem.send_keys("test@test.com");

        elem = self.driver.find_element_by_name("password")
        elem.send_keys("pass1");

        elem = self.driver.find_element_by_name("confirmPassword")
        elem.send_keys("pass2");

        elem = self.driver.find_element_by_name("createaccount")
        elem.click()

        assert "Your usernames or passwords do not match" in self.driver.page_source

    def test_email_already_exists(self):
        # make sure test@test.com account already exists - it should be by default
        self.driver.get(url)

        elem = self.driver.find_element_by_name("email")
        elem.send_keys("test@test.com");

        elem = self.driver.find_element_by_name("confirmEmail")
        elem.send_keys("test@test.com");

        elem = self.driver.find_element_by_name("password")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("confirmPassword")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("createaccount")
        elem.click()

        assert "Database error: email already used" in self.driver.page_source

    def test_account_creation(self):
        # attempts to make a new account with a partially random email. Hopefully no collisions
        self.driver.get(url)

        email = "unittest" + str(random.randrange(1, 10000)) + "@test.com"

        elem = self.driver.find_element_by_name("email")
        elem.send_keys(email);

        elem = self.driver.find_element_by_name("confirmEmail")
        elem.send_keys(email);

        elem = self.driver.find_element_by_name("password")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("confirmPassword")
        elem.send_keys("pass");

        elem = self.driver.find_element_by_name("createaccount")
        elem.click()

        assert "FileBoard" == self.driver.title

if __name__ == "__main__":
    unittest.main()
