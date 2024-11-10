import random
import time


class Agent:
    ident = 0

    def __init__(self):
        self.id = Agent.ident
        Agent.ident += 1

    def get_chosen_column(self, state, max_depth):
        pass


class Human(Agent):
    pass


class ConnectFourAgent(Agent):
    def __init__(self):
        super().__init__()

    def get_chosen_column(self, state, max_depth):
        best_move = self.minimax(state, max_depth, True, -float('inf'), float('inf'))
        return best_move['column']

    def minimax(self, state, depth, maximizing_player, alpha, beta):
        if depth == 0:
            return {'column': None}  # No scoring at the end, just return None for terminal states

        valid_moves = self.get_valid_moves(state)
        best_move = {'column': valid_moves[0] if valid_moves else None}

        for move in valid_moves:
            new_state = self.simulate_move(state, move, self.id if maximizing_player else 1 - self.id)
            result = self.minimax(new_state, depth - 1, not maximizing_player, alpha, beta)
            
            if maximizing_player:
                if best_move['column'] is None or result['column'] is not None:
                    best_move = result
                alpha = max(alpha, result.get('column', -float('inf')))
            else:
                if best_move['column'] is None or result['column'] is not None:
                    best_move = result
                beta = min(beta, result.get('column', float('inf')))
            
            if beta <= alpha:
                break  # Prune the branch if the opponent will not let this branch affect the result

        return best_move

    def simulate_move(self, state, column, player_id):
        new_state = [row[:] for row in state]  # Create a copy of the board
        for row in reversed(range(len(state))):  # Drop piece from the bottom
            if new_state[row][column] == 0:  # Find the first empty row in the column
                new_state[row][column] = player_id
                break
        return new_state

    def get_valid_moves(self, state):
        return [col for col in range(len(state[0])) if state[0][col] == 0]  # If the top row is empty
    

board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]

agent = ConnectFourAgent()

# Get the best move for the AI (player 0) with a maximum depth of 4
best_move = agent.get_chosen_column(board, 4)

# Output the best column for the AI to play
print(f"The best column for the AI to play is: {best_move}")