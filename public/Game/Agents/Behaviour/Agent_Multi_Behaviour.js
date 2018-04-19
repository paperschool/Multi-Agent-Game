
class Multi_Agent_Behaviour extends Agent_Behaviour {

  constructor(agentObject){

    super(agentObject);

    // tree
    this.behaviour = new BehaviourTree({
      title: 'agent-behaviour',

      tree: new BehaviourTree.Sequence({

        title:'mainSequence',
        // nodes:['Full','Hungry','Critical']
        nodes:[

          // navigation sub tree
          new BehaviourTree.Priority({
            title:'navigateAgent',
            nodes:[

              // player location visible and audible
              new BehaviourTree.Priority({
                title: 'playerLocatable',
                nodes: [

                  // task that is fired to check player visibility
                  new BehaviourTree.Sequence({
                    title:'pursueVisiblePlayerMulti',
                    nodes:[

                      // running sequence of checks
                      new BehaviourTree.Sequence({
                        title:'playerVisibleMulti',
                        nodes:[
                          'playerWithinViewCone',
                          'playerWithinLineOfSight',
                          'setLastKnownPlayerPosition',
                          'setAgentPathfindingFocus-PLAYER',

                          // modified alert that will trigger message system
                          new BehaviourTree.Task({
                            title:'alertAgentMulti',
                            run:function(agent){
                              agent.alertAgent();
                              agent.broadcast(AgentMessageType.PLAYER_SEEN);
                              this.success();
                            }
                          })
                        ]
                      }),

                      'pursueFocusPosition'
                    ]
                  }),

                  'pursueAudiblePlayer'
                ]
              }),

              // this node runs when the player is not visible or audible
              new BehaviourTree.Priority({
                title: 'playerNotLocatable',
                nodes: [

                  'agentAlerted',

                  // this sequence will attempt to run assuming the agent is not alerted
                  new BehaviourTree.Sequence({
                    title:'agentRelaxed',
                    nodes:[
                      'agentWander'
                    ]
                  })

                ]
              })

            ]
          }),

          // attacking sub tree
          new BehaviourTree.Sequence({
            title:'attackPlayer',
            nodes:[
              'isAgentAlert',
              'playerWithinLineOfSight',
              'withinShootingRange',
              'ShootPlayer'
            ]
          }),

        ]

      })
    });

    this.behaviour.setObject(agentObject);

  }

  step(){
    this.behaviour.step();
  }

}
