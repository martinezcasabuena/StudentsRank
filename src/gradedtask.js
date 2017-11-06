import Task from './task.js';

/**
 * GradedTask class. Create a graded task in order to be evaluated 
 * for every student engaged. Theory tests and procedure practices 
 * are part of this category.
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {int} weight - task weight
 * @tutorial pointing-criteria
 */

class GradedTask extends Task {
  constructor(name,description,weight) {
    super(name,description);
    this.weight = weight;
  }
}

export default GradedTask;
