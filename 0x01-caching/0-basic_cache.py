#!/usr/bin/env python3
""" BasicCache module """


class BaseCaching:
    def __init__(self):
        """
        Initialize the object with an empty dictionary to store cached data.
        """
        self.cache_data = {}

    def print_cache(self):
        print(self.cache_data)


class BasicCache(BaseCaching):
    def __init__(self):
        """
        Constructor for the class, initializes the object.
        """
        super().__init__()

    def put(self, key, item):
        """
        Puts the item into the cache_data dictionary with the given key.

        :param key: The key for the item
        :param item: The item to be cached
        :return: None
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        - Description: Get the value from the cache_data
        dictionary based on the input key.
        - Parameters:
            - key: The key to look up in the cache_data dictionary.
        - Return:
            - If the key is found in the cache_data, return the
            corresponding value. Otherwise, return None.
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
