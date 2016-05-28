import pymongo
client = pymongo.MongoClient("localhost", 27017)
db = client.test
if db.test_collection.find_one({'title':'a'}) == None:
    print('inserted ', db.test_collection.insert_one({'title':'a'}).inserted_id)
