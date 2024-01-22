import { gql, SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

class HasRoleDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const allowedRoles = this.args.roles;

    field.resolve = async function (...args) {
      const [, , context] = args;

      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      const userRoles = context.user.roles;

      if (!userRoles.some(role => allowedRoles.includes(role))) {
        throw new AuthenticationError('Insufficient permissions');
      }

      return resolve.apply(this, args);
    };
  }
}

export default gql`
  directive @auth on FIELD_DEFINITION
  directive @hasRole(role: Role = [USER, ADMIN]) on OBJECT | FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`;
