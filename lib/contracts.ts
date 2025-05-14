// Contract ABIs and addresses

// Supermarket contract address on Starknet Sepolia
export const SUPERMARKET_CONTRACT_ADDRESS = "0x0329af544efd8bd9b2e71a2b3b8058403633f4f5ad234d98a2a5ccb81e541fb4";

// Basic ABI for the Supermarket contract
// This is a placeholder - replace with the actual ABI of your contract
export const SUPERMARKET_ABI = [
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "impl",
    "name": "UpgradeableImpl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "items": [
      {
        "type": "function",
        "name": "upgrade",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "SuperMarketImpl",
    "interface_name": "super_market::interfaces::ISuper_market::ISuperMarket"
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::Structs::Structs::Product",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "price",
        "type": "core::integer::u32"
      },
      {
        "name": "stock",
        "type": "core::integer::u32"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "category",
        "type": "core::felt252"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::Structs::Structs::PurchaseItem",
    "members": [
      {
        "name": "product_id",
        "type": "core::integer::u32"
      },
      {
        "name": "quantity",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::Structs::Structs::OrderItem",
    "members": [
      {
        "name": "product_id",
        "type": "core::integer::u32"
      },
      {
        "name": "product_name",
        "type": "core::felt252"
      },
      {
        "name": "quantity",
        "type": "core::integer::u32"
      },
      {
        "name": "price",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::Structs::Structs::Order",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "trans_id",
        "type": "core::felt252"
      },
      {
        "name": "buyer",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "total_cost",
        "type": "core::integer::u32"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      },
      {
        "name": "items_count",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::Structs::Structs::RewardTier",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "threshold",
        "type": "core::integer::u32"
      },
      {
        "name": "image_uri",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::option::Option::<super_market::Structs::Structs::RewardTier>",
    "variants": [
      {
        "name": "Some",
        "type": "super_market::Structs::Structs::RewardTier"
      },
      {
        "name": "None",
        "type": "()"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::option::Option::<super_market::Structs::Structs::Order>",
    "variants": [
      {
        "name": "Some",
        "type": "super_market::Structs::Structs::Order"
      },
      {
        "name": "None",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "super_market::interfaces::ISuper_market::ISuperMarket",
    "items": [
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_admin",
        "inputs": [
          {
            "name": "admin",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "remove_admin",
        "inputs": [
          {
            "name": "admin",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "is_admin",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_owner_or_admin",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_admins",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_admin_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "withdraw_funds",
        "inputs": [
          {
            "name": "to",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "pause_contract",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "unpause_contract",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "contract_is_paused",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "add_product",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "price",
            "type": "core::integer::u32"
          },
          {
            "name": "stock",
            "type": "core::integer::u32"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "category",
            "type": "core::felt252"
          },
          {
            "name": "image",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_product",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          },
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "price",
            "type": "core::integer::u32"
          },
          {
            "name": "stock",
            "type": "core::integer::u32"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "category",
            "type": "core::felt252"
          },
          {
            "name": "image",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_prdct_id",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "delete_product",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_products",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::Structs::Structs::Product>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_product_by_id",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "super_market::Structs::Structs::Product"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_sales",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "buy_product",
        "inputs": [
          {
            "name": "purchases",
            "type": "core::array::Array::<super_market::Structs::Structs::PurchaseItem>"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_order_items",
        "inputs": [
          {
            "name": "order_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::Structs::Structs::OrderItem>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_all_orders_with_items",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<(super_market::Structs::Structs::Order, core::array::Array::<super_market::Structs::Structs::OrderItem>)>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_buyer_order_count",
        "inputs": [
          {
            "name": "buyer",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_buyer_orders_with_items",
        "inputs": [
          {
            "name": "buyer",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<(super_market::Structs::Structs::Order, core::array::Array::<super_market::Structs::Structs::OrderItem>)>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "calculate_token_amount",
        "inputs": [
          {
            "name": "purchases",
            "type": "core::array::Array::<super_market::Structs::Structs::PurchaseItem>"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_reward_tier_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "add_reward_tier",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "threshold",
            "type": "core::integer::u32"
          },
          {
            "name": "image_uri",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_reward_tier",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          },
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "threshold",
            "type": "core::integer::u32"
          },
          {
            "name": "image_uri",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "delete_reward_tier",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_reward_tier_by_id",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::option::Option::<super_market::Structs::Structs::RewardTier>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_reward_tiers",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::Structs::Structs::RewardTier>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_order_by_trans_id",
        "inputs": [
          {
            "name": "trans_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::option::Option::<super_market::Structs::Structs::Order>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "check_reward_eligibility",
        "inputs": [
          {
            "name": "trans_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::option::Option::<super_market::Structs::Structs::RewardTier>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "claim_reward",
        "inputs": [
          {
            "name": "trans_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "PausableImpl",
    "interface_name": "openzeppelin_security::interface::IPausable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_security::interface::IPausable",
    "items": [
      {
        "type": "function",
        "name": "is_paused",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "AccessControlMixinImpl",
    "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
    "items": [
      {
        "type": "function",
        "name": "has_role",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_role_admin",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "grant_role",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "revoke_role",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_role",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "hasRole",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "getRoleAdmin",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "grantRole",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "revokeRole",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounceRole",
        "inputs": [
          {
            "name": "role",
            "type": "core::felt252"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "supports_interface",
        "inputs": [
          {
            "name": "interface_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "default_admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "nft_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Paused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
    "kind": "struct",
    "members": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_security::pausable::PausableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Paused",
        "type": "openzeppelin_security::pausable::PausableComponent::Paused",
        "kind": "nested"
      },
      {
        "name": "Unpaused",
        "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
    "kind": "struct",
    "members": [
      {
        "name": "role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "previous_admin_role",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "new_admin_role",
        "type": "core::felt252",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "RoleGranted",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
        "kind": "nested"
      },
      {
        "name": "RoleRevoked",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
        "kind": "nested"
      },
      {
        "name": "RoleAdminChanged",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_introspection::src5::SRC5Component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductCreated",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "stock",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "category",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "stock",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "category",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductDeleted",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductPurchased",
    "kind": "struct",
    "members": [
      {
        "name": "buyer",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "total_cost",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::WithdrawalMade",
    "kind": "struct",
    "members": [
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "amount",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::AdminAdded",
    "kind": "struct",
    "members": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::AdminRemoved",
    "kind": "struct",
    "members": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::RewardTierAdded",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "threshold",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "image_uri",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::RewardTierUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "threshold",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "image_uri",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::RewardTierDeleted",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::RewardClaimed",
    "kind": "struct",
    "members": [
      {
        "name": "buyer",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "order_id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "reward_tier_id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "claimed_at",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::contracts::super_market::SuperMarketV0::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PausableEvent",
        "type": "openzeppelin_security::pausable::PausableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "AccessControlEvent",
        "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
        "kind": "flat"
      },
      {
        "name": "SRC5Event",
        "type": "openzeppelin_introspection::src5::SRC5Component::Event",
        "kind": "flat"
      },
      {
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "flat"
      },
      {
        "name": "ProductCreated",
        "type": "super_market::events::super_market_event::ProductCreated",
        "kind": "nested"
      },
      {
        "name": "ProductUpdated",
        "type": "super_market::events::super_market_event::ProductUpdated",
        "kind": "nested"
      },
      {
        "name": "ProductDeleted",
        "type": "super_market::events::super_market_event::ProductDeleted",
        "kind": "nested"
      },
      {
        "name": "ProductPurchased",
        "type": "super_market::events::super_market_event::ProductPurchased",
        "kind": "nested"
      },
      {
        "name": "WithdrawalMade",
        "type": "super_market::events::super_market_event::WithdrawalMade",
        "kind": "nested"
      },
      {
        "name": "AdminAdded",
        "type": "super_market::events::super_market_event::AdminAdded",
        "kind": "nested"
      },
      {
        "name": "AdminRemoved",
        "type": "super_market::events::super_market_event::AdminRemoved",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferred",
        "type": "super_market::events::super_market_event::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "RewardTierAdded",
        "type": "super_market::events::super_market_event::RewardTierAdded",
        "kind": "nested"
      },
      {
        "name": "RewardTierUpdated",
        "type": "super_market::events::super_market_event::RewardTierUpdated",
        "kind": "nested"
      },
      {
        "name": "RewardTierDeleted",
        "type": "super_market::events::super_market_event::RewardTierDeleted",
        "kind": "nested"
      },
      {
        "name": "RewardClaimed",
        "type": "super_market::events::super_market_event::RewardClaimed",
        "kind": "nested"
      }
    ]
  }
];

// Helper function to format Starknet addresses for display
export function formatAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to convert wei to ETH with formatting
export function formatEther(value?: string): string {
  if (!value) return "0";
  return (Number(value) / 1e18).toFixed(4);
}
