from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from django.db.models import Count, Avg
from django.db.models.functions import TruncDate

from .models import Ticket
from .serializers import TicketSerializer
from .llm import classify_ticket


# -------------------------
# Classify Ticket View
# -------------------------
class ClassifyTicketView(APIView):

    def post(self, request):
        description = request.data.get("description", "")

        if not description:
            return Response({
                "suggested_category": None,
                "suggested_priority": None
            })

        result = classify_ticket(description)

        return Response(result)


# -------------------------
# List and Create Tickets
# -------------------------
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter


class TicketListCreateView(generics.ListCreateAPIView):

    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter]

    filterset_fields = ["category", "priority", "status"]

    search_fields = ["title", "description"]



# -------------------------
# Update Ticket
# -------------------------
class TicketUpdateView(generics.UpdateAPIView):

    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


# -------------------------
# Ticket Stats View
# -------------------------
class TicketStatsView(APIView):

    def get(self, request):

        total_tickets = Ticket.objects.count()

        open_tickets = Ticket.objects.filter(status="open").count()

        per_day = (
            Ticket.objects
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        )

        avg_tickets_per_day = per_day.aggregate(avg=Avg("count"))["avg"] or 0

        priority_data = (
            Ticket.objects
            .values("priority")
            .annotate(count=Count("id"))
        )

        priority_breakdown = {
            item["priority"]: item["count"]
            for item in priority_data
        }

        category_data = (
            Ticket.objects
            .values("category")
            .annotate(count=Count("id"))
        )

        category_breakdown = {
            item["category"]: item["count"]
            for item in category_data
        }

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": avg_tickets_per_day,
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })
