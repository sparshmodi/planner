import graphene
from .graphql import CourseQueries, TermScheduleQueries


class Query(CourseQueries, TermScheduleQueries, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=None)
