use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, json_types::U128, near_bindgen, setup_alloc, AccountId, Promise};

setup_alloc!();

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    owner: AccountId,
}

#[near_bindgen]
impl Welcome {
    #[init]
    pub fn init(owner_id: AccountId) -> Self {
        Self { owner: owner_id }
    }

    pub fn get_greeting(&self, name: String) -> String {
        String::from(format!("Hello, {}", name))
    }

    #[payable]
    pub fn send_tip(&mut self, name: String) -> String {
        String::from(format!("Thank you for coffee {}", name))
    }

    pub fn withdraw(&mut self, to: AccountId, amount: U128) {
        self.assert_owner();
        assert!(amount.0 <= env::account_balance());
        Promise::new(to).transfer(amount.0);
    }
}

pub trait Ownable {
    fn assert_owner(&self) {
        assert_eq!(env::predecessor_account_id(), self.get_owner());
    }
    fn get_owner(&self) -> AccountId;
    fn set_owner(&mut self, owner: AccountId);
}

impl Ownable for Welcome {
    fn get_owner(&self) -> AccountId {
        self.owner.clone()
    }

    fn set_owner(&mut self, owner: AccountId) {
        self.assert_owner();
        self.owner = owner;
    }
}
