from app.config import settings
_memory = {}

def _collection():
    if not settings.mongodb_uri:
        return None
    from pymongo import MongoClient
    client = MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=3000)
    return client[settings.mongodb_database]["research_reports"]

def save_report(report):
    collection = _collection()
    if collection is None:
        _memory[report["research_id"]] = report
    else:
        collection.replace_one({"research_id": report["research_id"]}, report, upsert=True)
    return report

def get_report(research_id):
    collection = _collection()
    if collection is None:
        return _memory.get(research_id)
    return collection.find_one({"research_id": research_id}, {"_id": 0})
