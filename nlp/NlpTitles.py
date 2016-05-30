# run with 'python3 nlpTitles.py'

import pymongo
from pymongo import MongoClient

from konlpy.corpus import kolaw
from konlpy.tag import Hannanum

from datetime import date
import threading

client = MongoClient('localhost', 27017)
db = client.politicat


def main():
    last_date = getLastDateInCrawlingToNlp()
    data = getDataFromCrawlingDB(last_date)
    insertDataToDB(data)


def getLastDateInCrawlingToNlp():
    row = db.last_date_nlp.find_one({})
    if row == None:
        return -1
    else:
        return row['date']


def getDataFromCrawlingDB(last_date):
    if last_date != -1:
        return db.articles.find({'date': {'$gte': last_date}})
    else:
        return db.articles.find({})


def worker(nouns, l):
    for n in nouns:
        # insert today_keyword
        if date.today().strftime("%Y%m%d") == l['date']:
            result = db.today_keywords.update_one({'keyword' : n}, {'$inc' : {'count' : 1}}, True)
            print('today_keywords updated')

        # insert keyword, keyword_relations
        n_obj = db.keywords.find_one({'keyword' : n})
        n_id = -1

        if n_obj == None:
            n_id = db.keywords.insert_one({'keyword' : n}).inserted_id
            print('keyword inserted: ', n_id)
        else:
            n_id = n_obj['_id']

        for related in nouns:
            if n == related:
                continue

            related_obj = db.keywords.find_one({'keyword' : related})
            related_id = -1

            if related_obj == None:
                related_id = db.keywords.insert_one({'keyword' : related}).inserted_id
                print('keyword inserted: ', related_id)
            else:
                related_id = related_obj['_id']

            relation_obj = db.keyword_relations.find_one({'keyword1_id' : n_id, 'keyword2_id' : related_id})
            if relation_obj == None:
                relation_obj = db.keyword_relations.find_one({'keyword1_id' : related_id, 'keyword2_id' : n_id})

            relation_id = -1

            if relation_obj == None:
                if date.today().strftime("%Y%m%d") == l['date']:
                    count_in_day = 1
                else:
                    count_in_day = 0

                relation_id = db.keyword_relations.insert_one({'keyword1_id' : n_id, 'keyword2_id' : related_id, 'updated_at' : l['date'], 'count_in_day' : count_in_day, 'total_count' : 1}).inserted_id
                print('relation inserted: ', relation_id)
            else:
                relation_id = relation_obj['_id']

                if date.today().strftime("%Y%m%d") == relation_obj['updated_at']:
                    result = db.keyword_relations.update_one({'_id' : relation_id}, {'$inc' : {'total_count' : 1, 'count_in_day' : 1}})
                    print('relation updated, count in day incremented : ', result.modified_count)
                else:
                    result = db.keyword_relations.update_one({'_id' : relation_id}, {'$inc' : {'total_count' : 1}, '$set' : {'count_in_day' : 1, 'updated_at' : l['date']}})
                    print('relation updated, init count in day to one : ', result.modified_count)


    result = db.last_date_nlp.update_one({}, {'$set': {'date': l['date']}}, True)
    print('last_date updated: ', result.raw_result)
    print('data: ', l)


def insertDataToDB(data):
    db.today_keywords.drop()

    for l in data:
        nouns = Hannanum().nouns(l['title'])

        threads = []
        t = threading.Thread(target=worker, args=(nouns,l,))
        threads.append(t)
        t.start()


main()
