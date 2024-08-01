import hashlib
import json
from time import time
from collections import Counter

class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

    @staticmethod
    def calculate_hash(index, previous_hash, timestamp, data):
        return hashlib.sha256(f'{index}{previous_hash}{timestamp}{data}'.encode()).hexdigest()

    @staticmethod
    def create_genesis_block():
        return Block(0, "0", int(time()), "Genesis Block", Block.calculate_hash(0, "0", int(time()), "Genesis Block"))
    
    @staticmethod
    def create_new_block(last_block, data):
        index = last_block.index + 1
        timestamp = int(time())
        hash = Block.calculate_hash(index, last_block.hash, timestamp, data)
        return Block(index, last_block.hash, timestamp, data, hash)

class Blockchain:
    def __init__(self):
        self.chain = [Block.create_genesis_block()]
        self.current_votes = []

    def get_last_block(self):
        return self.chain[-1]

    def add_block(self, data):
        new_block = Block.create_new_block(self.get_last_block(), data)
        self.chain.append(new_block)
        return new_block.hash  # Return the hash of the newly added block

    def vote(self, candidate):
        self.current_votes.append(candidate)
        # Add votes to the blockchain
        block_data = json.dumps(self.current_votes)
        last_block = self.get_last_block()
        self.add_block(block_data)
        self.current_votes = []  # Clear current votes after adding to the blockchain

    def find_block_by_hash(self, hash):
        for block in self.chain:
            if block.hash == hash:
                return block
        return None

    def remove_block(self, index):
        if index >= len(self.chain) or index < 0:
            return False  # Invalid index
        
        if index == 0:
            # Cannot remove the genesis block
            return False
        
        # Remove the block from the chain
        del self.chain[index]
        
        # Recalculate subsequent blocks
        for i in range(index, len(self.chain)):
            if i > 0:
                prev_block = self.chain[i - 1]
                current_block = self.chain[i]
                current_block.previous_hash = prev_block.hash
                current_block.hash = Block.calculate_hash(current_block.index, current_block.previous_hash, current_block.timestamp, current_block.data)

        return True

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            if current.hash != Block.calculate_hash(current.index, current.previous_hash, current.timestamp, current.data):
                return False

            if current.previous_hash != previous.hash:
                return False

        return True
    

    def count_votes(self, candidate=None):
        all_votes = []
        for block in self.chain:
            if block.index > 0:  # Skip the genesis block
                try:
                    print(f"Decoding block data: {block.data}")  # Debugging statement
                    votes = json.loads(block.data)
                    if isinstance(votes, list):
                        all_votes.extend(votes)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from block data: {e}")
                    print(f"Problematic data: {block.data}")  # Show problematic data
    
        # Count votes for the specific candidate or return all counts if no candidate is specified
        if candidate:
            return all_votes.count(candidate)
        else:
            return dict(Counter(all_votes))





"""
    my_blockchain = Blockchain()

    print("Blockchain valid?", my_blockchain.is_chain_valid())

    my_blockchain.add_block("First block data")
    my_blockchain.add_block("Second block data")

    print("\nBlockchain:")
    for block in my_blockchain.chain:
        print(f"Index: {block.index}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Data: {block.data}")
        print(f"Hash: {block.hash}\n")

    print("Blockchain valid?", my_blockchain.is_chain_valid())


-------------------------------------------------------------
    block = my_blockchain.find_block_by_hash(hash1)
if block:
    print(f"Block found: Index {block.index}, Data {block.data}")

# Remove a block
print("Removing block at index 1")
success = my_blockchain.remove_block(1)
print("Block removed:", success)
"""