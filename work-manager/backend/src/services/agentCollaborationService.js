const Agent = require('../models/Agent');
const Workflow = require('../models/Workflow');
const Conversation = require('../models/Conversation');

/**
 * Service to handle collaborative interactions between agents.
 */
class AgentCollaborationService {
  /**
   * Initiates a conversation between agents
   * @param {Array} agentIds - Array of agent IDs participating in the conversation
   * @param {Object} context - Conversation context
   * @param {String} initialPrompt - Initial prompt to start the conversation
   * @returns {Object} - Conversation result
   */
  async initiateConversation(agentIds, context, initialPrompt) {
    try {
      // Load all agents
      const agents = await Agent.find({ _id: { $in: agentIds } });
      if (agents.length !== agentIds.length) {
        throw new Error('Some agents could not be found');
      }

      // Initialize conversation
      const conversation = new Conversation({
        participants: agents.map(agent => ({
          agentId: agent._id,
          name: agent.name,
          type: agent.type,
          role: agent.role
        })),
        context,
        messages: [{
          role: 'system',
          content: initialPrompt,
          timestamp: new Date()
        }],
        status: 'active',
        startedAt: new Date()
      });

      // Save the initial conversation
      await conversation.save();

      // For demonstration purposes, we'll simulate agent responses
      // In a real implementation, this would call an LLM API for each agent
      for (const agent of agents) {
        const response = await this._simulateAgentResponse(agent, conversation);
        
        // Add the agent's response to the conversation
        conversation.messages.push({
          role: agent.type,
          agentId: agent._id,
          name: agent.name,
          content: response,
          timestamp: new Date()
        });
        
        // Save after each message to maintain state
        await conversation.save();
      }

      return conversation;
    } catch (error) {
      console.error('Error in agent conversation:', error);
      throw error;
    }
  }

  /**
   * Simulates a response from an agent based on its type and the conversation context
   * In a real implementation, this would call an LLM with the agent's system prompt
   * @param {Object} agent - The agent object
   * @param {Object} conversation - The current conversation state
   * @returns {String} - The simulated agent response
   */
  async _simulateAgentResponse(agent, conversation) {
    // This is a placeholder. In a real implementation, this would call an LLM API.
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    switch (agent.type) {
      case 'product_manager':
        return `As a product manager, I'd like to understand more about your requirements. Can you tell me more about your goals, target users, and key problems you're trying to solve?`;
      
      case 'technical_leader':
        if (lastMessage.role === 'user' || lastMessage.role === 'system') {
          return `From a technical perspective, we should also consider scalability requirements, integration points, and existing systems this will need to work with.`;
        } else if (lastMessage.role === 'product_manager') {
          return `I'd like to add some technical considerations to what the product manager asked. What existing systems will this need to integrate with? Do you have any specific performance or scalability requirements?`;
        }
        break;
      
      case 'designer':
        if (lastMessage.role === 'user' || lastMessage.role === 'system') {
          return `From a design perspective, I'd like to understand your brand guidelines, any existing design systems, and the user experience you're aiming for.`;
        } else if (lastMessage.role === 'product_manager') {
          return `Building on what the product manager asked, could you share any existing products or interfaces you like? What aspects of the user experience are most important to you?`;
        }
        break;
      
      default:
        return `I'm ${agent.name}, a ${agent.type}. How can I help with this project?`;
    }
  }

  /**
   * Creates a product discovery workflow with the three specialized agents
   * @param {String} projectName - Name of the project
   * @param {String} createdBy - ID of the user creating the workflow
   * @returns {Object} - The created workflow
   */
  async createProductDiscoveryWorkflow(projectName, createdBy) {
    try {
      // 1. Create the three specialized agents if they don't already exist
      const productManagerAgent = await this._ensureAgentExists({
        name: 'Product Manager',
        type: 'product_manager',
        role: 'Lead requirements gathering',
        systemPrompt: 'You are an experienced product manager who excels at gathering requirements from customers. Ask clear questions to understand their needs, goals, and constraints.',
        capabilities: ['requirements_gathering', 'user_story_creation', 'prioritization'],
        createdBy
      });

      const technicalLeaderAgent = await this._ensureAgentExists({
        name: 'Technical Leader',
        type: 'technical_leader',
        role: 'Advise on technical aspects',
        systemPrompt: 'You are a senior technical leader who helps identify technical requirements. Listen for technical implications in customer requirements and suggest questions to gather necessary technical details.',
        capabilities: ['technical_analysis', 'architecture_design', 'feasibility_assessment'],
        createdBy
      });

      const designerAgent = await this._ensureAgentExists({
        name: 'UI/UX Designer',
        type: 'designer',
        role: 'Advise on design aspects',
        systemPrompt: 'You are an experienced UI/UX designer who helps identify design requirements. Listen for design implications in customer requirements and suggest questions to gather necessary user experience details.',
        capabilities: ['ux_analysis', 'design_requirements_gathering', 'user_research'],
        createdBy
      });

      // 2. Create the product discovery workflow
      const workflow = new Workflow({
        name: `${projectName} - Product Discovery`,
        description: 'Collaborative workflow for product discovery with a team of specialized agents',
        type: 'discovery',
        participants: [
          { agentId: productManagerAgent._id, role: 'lead' },
          { agentId: technicalLeaderAgent._id, role: 'advisor' },
          { agentId: designerAgent._id, role: 'advisor' }
        ],
        steps: [
          {
            name: 'Initial Customer Interview',
            description: 'Initial interview to understand customer needs and project goals',
            type: 'collaboration',
            agentId: productManagerAgent._id,
            actionType: 'collect_info',
            prompt: 'Conduct an initial interview with the customer to understand their business, goals, and high-level requirements.',
            collaborators: [
              { agentId: technicalLeaderAgent._id, role: 'advisor', actionType: 'advise' },
              { agentId: designerAgent._id, role: 'advisor', actionType: 'advise' }
            ],
            nextSteps: ['Requirements Refinement'],
            expectedOutput: {
              format: 'document',
              sections: ['Project Overview', 'Business Goals', 'Initial Requirements', 'Constraints', 'Follow-up Questions']
            }
          },
          {
            name: 'Requirements Refinement',
            description: 'Detailed requirements gathering with technical and design input',
            type: 'collaboration',
            agentId: productManagerAgent._id,
            actionType: 'collect_info',
            prompt: 'Based on the initial interview, gather more detailed requirements with technical and design considerations.',
            collaborators: [
              { agentId: technicalLeaderAgent._id, role: 'advisor', actionType: 'advise' },
              { agentId: designerAgent._id, role: 'advisor', actionType: 'advise' }
            ],
            nextSteps: ['Requirements Document Creation'],
            expectedOutput: {
              format: 'structured_data',
              schema: {
                functional_requirements: 'array',
                technical_requirements: 'array',
                design_requirements: 'array',
                constraints: 'array',
                open_questions: 'array'
              }
            }
          },
          {
            name: 'Requirements Document Creation',
            description: 'Create a comprehensive requirements document',
            type: 'agent_task',
            agentId: productManagerAgent._id,
            actionType: 'execute',
            prompt: 'Create a comprehensive requirements document based on all gathered information.',
            nextSteps: ['Technical Review', 'Design Review'],
            expectedOutput: {
              format: 'document',
              sections: ['Executive Summary', 'Business Goals', 'User Personas', 'Functional Requirements', 'Technical Requirements', 'Design Requirements', 'Constraints', 'Timeline', 'Success Metrics']
            }
          },
          {
            name: 'Technical Review',
            description: 'Technical review of the requirements document',
            type: 'agent_task',
            agentId: technicalLeaderAgent._id,
            actionType: 'review',
            prompt: 'Review the requirements document from a technical perspective and provide feedback.',
            nextSteps: ['Finalize Requirements'],
            expectedOutput: {
              format: 'document',
              sections: ['Technical Feasibility', 'Technical Risks', 'Architecture Recommendations', 'Integration Considerations', 'Technical Feedback']
            }
          },
          {
            name: 'Design Review',
            description: 'Design review of the requirements document',
            type: 'agent_task',
            agentId: designerAgent._id,
            actionType: 'review',
            prompt: 'Review the requirements document from a design perspective and provide feedback.',
            nextSteps: ['Finalize Requirements'],
            expectedOutput: {
              format: 'document',
              sections: ['User Experience Considerations', 'Design Risks', 'Design Recommendations', 'Usability Feedback', 'Design Feedback']
            }
          },
          {
            name: 'Finalize Requirements',
            description: 'Incorporate feedback and finalize the requirements document',
            type: 'collaboration',
            agentId: productManagerAgent._id,
            actionType: 'execute',
            prompt: 'Incorporate technical and design feedback to finalize the requirements document.',
            collaborators: [
              { agentId: technicalLeaderAgent._id, role: 'reviewer', actionType: 'approve' },
              { agentId: designerAgent._id, role: 'reviewer', actionType: 'approve' }
            ],
            expectedOutput: {
              format: 'document',
              sections: ['Final Requirements Document']
            }
          }
        ],
        triggers: [
          {
            type: 'manual',
            configuration: {
              role: 'product_manager'
            }
          }
        ],
        status: 'draft',
        metadata: {
          domain: 'software_development',
          audience: 'customers',
          complexity: 'medium'
        },
        createdBy,
        variables: [
          {
            name: 'customerName',
            description: 'Name of the customer or project sponsor',
            defaultValue: ''
          },
          {
            name: 'projectScope',
            description: 'Brief description of the project scope',
            defaultValue: ''
          }
        ]
      });

      const savedWorkflow = await workflow.save();
      return savedWorkflow;
    } catch (error) {
      console.error('Error creating product discovery workflow:', error);
      throw error;
    }
  }

  /**
   * Ensures an agent with the given properties exists, creating it if necessary
   * @param {Object} agentProps - Properties of the agent to ensure
   * @returns {Object} - The existing or newly created agent
   */
  async _ensureAgentExists(agentProps) {
    try {
      // Check if agent exists
      let agent = await Agent.findOne({ name: agentProps.name, type: agentProps.type });
      
      // If not, create it
      if (!agent) {
        agent = new Agent({
          ...agentProps,
          isActive: true
        });
        await agent.save();
      }
      
      return agent;
    } catch (error) {
      console.error(`Error ensuring agent exists: ${agentProps.name}`, error);
      throw error;
    }
  }
}

module.exports = new AgentCollaborationService(); 