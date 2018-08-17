# ToDoList api documentation

| api URL | HTTP Method | Request JSON | Response JSON |
| ------ | ------ | ------ | ------ |
| /api/auth | POST | {"username": "userlogin", "password": "userpass"} | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn"} |
| /api/tasks | GET |  | [{"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"}] |
| /api/tasks/taskid | GET |  | {"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"} |
| /api/tasks | POST | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "name": "task name example", "description": "description for task", "date": "11.08.2018"} | {"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"} |
| /api/tasks/taskid | PUT | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "task_id": "idexample","name": "new task name", "date": "13.08.2018"} | {"name": "new task name", "description": "description for task", "task_id": "idexample", "date": "13.08.2018"} |
| /api/tasks/taskid | DELETE | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "task_id": "idexample"} | {"message": "task was deleted"} |
