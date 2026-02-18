from django.urls import path
from .views import (
    ClassifyTicketView,
    TicketListCreateView,
    TicketUpdateView,
    TicketStatsView,
)

urlpatterns = [
    path("classify/", ClassifyTicketView.as_view(), name="classify-ticket"),
    path("stats/", TicketStatsView.as_view(), name="ticket-stats"),
    path("", TicketListCreateView.as_view(), name="ticket-list-create"),
    path("<int:pk>/", TicketUpdateView.as_view(), name="ticket-update"),
]
