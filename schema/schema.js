const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({  // Make fields a function to get around JS hoisting issue
    id: { type:  GraphQLString},
    name: { type:  GraphQLString},
    menus: {
      type: new GraphQLList(MenuType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/venues/${parentValue.id}/menus`)
          .then(response => response.data);
      }
    }
  })
});

const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: () => ({
    id: { type:  GraphQLString},
    eventTypeName: { type:  GraphQLString},
    venue: {
      type: VenueType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/venues/${parentValue.venueId}`)
          .then(res => res.data);
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    menu: {
      type: MenuType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/menus/${args.id}`)
          .then(response => response.data);
      }
    },
    venue: {
      type: VenueType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/venues/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType ({
  name: 'Mutation',
  fields: {
    addMenu: {
      type: MenuType,
      args: {
        eventTypeName: { type: new GraphQLNonNull(GraphQLString) },
        venueId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { eventTypeName, venueId }) {
        return axios.post(`http://localhost:3000/menus`, { eventTypeName, venueId })
          .then(response => response.data);
      }
    },
    deleteMenu: {
      type: MenuType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) }},
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/menus/${args.id}`)
          .then(res => res.data);
      }
    },
    updateMenu: {
      type: MenuType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        eventTypeName: { type: GraphQLString },
        venueId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/menus/${args.id}`, args)
          .then(response => response.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
