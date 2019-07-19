class Commit {
  constructor(message, time, steps, maps, hidden) {
    this.message = message;
    this.time = time;
    this.steps = steps;
    this.maps = maps;
    this.hidden = hidden;
  }
}

export default class TrackState {
  constructor(blameMap, commits, uncommittedSteps, uncommittedMaps) {
    this.blameMap = blameMap;
    this.commits = commits;
    this.uncommittedSteps = uncommittedSteps;
    this.uncommittedMaps = uncommittedMaps;
  }

  applyTransform = transform => {
    const inverted = transform.steps.map((step, i) =>
      step.invert(transform.docs[i])
    );
    return new TrackState(
      this.blameMap,
      this.commits,
      this.uncommittedSteps.concat(inverted),
      this.uncommittedMaps.concat(transform.mapping.maps)
    );
  };

  applyCommit = (message, time) => {
    if (this.uncommittedSteps.length === 0) return undefined;
    const commit = new Commit(
      message,
      time,
      this.uncommittedSteps,
      this.uncommittedMaps
    );
    this.commits.push(commit);
    return new TrackState(this.blameMap, this.commits, [], []);
  };
}