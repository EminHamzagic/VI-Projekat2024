from rest_framework.decorators import api_view
from rest_framework.response import Response
from .algorithms import BreadthFirstSearch, BestFirstSearch, AStarSearch
from .heuristics import HammingDistance, ManhattanDistance

@api_view(['POST'])
def solve_puzzle(request):
    initial_state = tuple(request.data.get('initial_state'))
    goal_state = tuple(request.data.get('goal_state'))
    algorithm = request.data.get('algorithm')
    heuristic = request.data.get('heuristic')
    
    if not all([initial_state, goal_state, algorithm]):
        return Response({'error': 'Missing required parameters'}, status=400)
    
    algorithms = {
        'bfs': BreadthFirstSearch(),
        'best_first': BestFirstSearch(heuristic=ManhattanDistance() if heuristic == 'manhattan' else HammingDistance()),
        'astar': AStarSearch(heuristic=ManhattanDistance() if heuristic == 'manhattan' else HammingDistance())
    }
    
    solver = algorithms.get(algorithm)
    if not solver:
        return Response({'error': 'Invalid algorithm'}, status=400)
    
    try:
        steps = solver.get_steps(initial_state, goal_state)
        return Response({'steps': steps})
    except Exception as e:
        return Response({'error': str(e)}, status=400)