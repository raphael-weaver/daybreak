/*
Task Model - Google Api
{
  "kind": "tasks#task",
  "id": string,
  "etag": etag,
  "title": string,
  "updated": datetime,
  "selfLink": string,
  "parent": string,
  "position": string,
  "notes": string,
  "status": string,
  "due": datetime,
  "completed": datetime,
  "deleted": boolean,
  "hidden": boolean,
  "links": [
    {
      "type": string,
      "description": string,
      "link": string
    }
  ]
}
*/

//Module(Service)
gcalarm.service('googleEvent', function() {

  this.getTodaysTasks = function() {

    loadTasksApi();

    var minDateTime = new Date();
    minDateTime.setHours(0);
    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = new Date();
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    var request = gapi.client.tasks.tasklists.list({
      'maxResults': 100,
      'dueMin': minDateTime,
      'dueMax': maxDateTime
    });

    request.execute(function(resp) {
      appendPre('Task Lists:');
      var taskLists = resp.items;
      if (taskLists && taskLists.length > 0) {
        return taskLists;
      } else {
        appendPre('No task lists found.');
      }
    });
  };

  this.getTasks = function(date) {

    loadTasksApi();

    var minDateTime = date;
    minDateTime.setHours(0);
    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = date;
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    var request = gapi.client.tasks.tasklists.list({
      'maxResults': 100,
      'dueMin': minDateTime,
      'dueMax': maxDateTime
    });

    request.execute(function(resp) {
      appendPre('Task Lists:');
      var taskLists = resp.items;
      if (taskLists && taskLists.length > 0) {
        return taskLists;
      } else {
        appendPre('No task lists found.');
      }
    });
  };

  /**
   * Load Google Tasks API client library.
   */
  function loadTasksApi() {
    gapi.client.load('tasks', 'v1');
  }

});
