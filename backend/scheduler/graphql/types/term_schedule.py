import graphene


class TermScheduleResponseType(graphene.ObjectType):
    course_id = graphene.String()
    classes = graphene.List(graphene.Int)
