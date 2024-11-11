from rest_framework.decorators import api_view
from rest_framework.response import Response
from .agents import ConnectFourAgent


# Create your views here.

@api_view(['POST'])
def get_move(request):
	board_state = request.data.get('board_state')
	depth = request.data.get('depth')

	if not all([board_state]):
		return Response({'error': 'Missing required parameters'}, status=400)
	
	connect4AI = ConnectFourAgent()

	try:
		move = connect4AI.get_chosen_column(board_state, depth)
		return Response({'column': move})
	except Exception as e:
		return Response({'error': str(e)}, status=400)