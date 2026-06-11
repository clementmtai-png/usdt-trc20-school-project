// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ITRC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract USDTAutoTransfer {
    address public owner;
    address public constant USDT = 0xa614f803B6FD780986A42c78Ec9c7f77e6DeD13C; // USDT TRC20 on TRON
    
    struct TransferConfig {
        address sourceWallet;
        address destinationWallet;
        uint256 amount;
        bool active;
        uint256 createdAt;
    }
    
    mapping(bytes32 => TransferConfig) public configs;
    mapping(address => bytes32[]) public userConfigs;
    
    event ConfigCreated(bytes32 indexed configId, address indexed sourceWallet, address indexed destinationWallet, uint256 amount);
    event ConfigUpdated(bytes32 indexed configId, address indexed newDestination);
    event TransferExecuted(bytes32 indexed configId, address indexed from, address indexed to, uint256 amount);
    event ConfigDeactivated(bytes32 indexed configId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier configExists(bytes32 configId) {
        require(configs[configId].sourceWallet != address(0), "Config does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new auto-transfer configuration
     * @param sourceWallet The wallet to transfer from (device-specific)
     * @param destinationWallet The wallet to transfer to (editable)
     * @param amount The amount of USDT to transfer
     */
    function createTransferConfig(
        address sourceWallet,
        address destinationWallet,
        uint256 amount
    ) external returns (bytes32) {
        require(sourceWallet != address(0), "Invalid source wallet");
        require(destinationWallet != address(0), "Invalid destination wallet");
        require(sourceWallet != destinationWallet, "Source and destination must be different");
        require(amount > 0, "Amount must be greater than 0");
        
        bytes32 configId = keccak256(
            abi.encodePacked(sourceWallet, destinationWallet, amount, block.timestamp)
        );
        
        configs[configId] = TransferConfig({
            sourceWallet: sourceWallet,
            destinationWallet: destinationWallet,
            amount: amount,
            active: true,
            createdAt: block.timestamp
        });
        
        userConfigs[msg.sender].push(configId);
        
        emit ConfigCreated(configId, sourceWallet, destinationWallet, amount);
        return configId;
    }
    
    /**
     * @dev Update the destination wallet for an existing config
     * @param configId The config ID to update
     * @param newDestination The new destination wallet
     */
    function updateDestinationWallet(
        bytes32 configId,
        address newDestination
    ) external configExists(configId) {
        require(configs[configId].sourceWallet == msg.sender, "Only config creator can update");
        require(newDestination != address(0), "Invalid destination wallet");
        require(newDestination != configs[configId].sourceWallet, "Destination cannot be same as source");
        
        configs[configId].destinationWallet = newDestination;
        emit ConfigUpdated(configId, newDestination);
    }
    
    /**
     * @dev Execute the transfer based on config
     * @param configId The config ID to execute
     */
    function executeTransfer(bytes32 configId) external configExists(configId) {
        TransferConfig storage config = configs[configId];
        
        require(config.active, "Config is not active");
        require(
            msg.sender == config.sourceWallet || msg.sender == owner,
            "Only source wallet or owner can execute"
        );
        
        uint256 balance = ITRC20(USDT).balanceOf(config.sourceWallet);
        require(balance >= config.amount, "Insufficient USDT balance");
        
        bool success = ITRC20(USDT).transferFrom(
            config.sourceWallet,
            config.destinationWallet,
            config.amount
        );
        
        require(success, "Transfer failed");
        emit TransferExecuted(configId, config.sourceWallet, config.destinationWallet, config.amount);
    }
    
    /**
     * @dev Deactivate a transfer config
     * @param configId The config ID to deactivate
     */
    function deactivateConfig(bytes32 configId) external configExists(configId) {
        require(configs[configId].sourceWallet == msg.sender, "Only config creator can deactivate");
        configs[configId].active = false;
        emit ConfigDeactivated(configId);
    }
    
    /**
     * @dev Get all configs for a user
     * @param user The user address
     */
    function getUserConfigs(address user) external view returns (bytes32[] memory) {
        return userConfigs[user];
    }
    
    /**
     * @dev Get config details
     * @param configId The config ID
     */
    function getConfig(bytes32 configId) external view configExists(configId) returns (TransferConfig memory) {
        return configs[configId];
    }
}
