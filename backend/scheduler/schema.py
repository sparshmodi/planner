import graphene
from .graphql import CourseQueries


class Query(CourseQueries, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=None)
