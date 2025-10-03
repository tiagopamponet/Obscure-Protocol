use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use sha2::{Sha256, Digest};
use std::str::FromStr;

declare_id!("8KYeVB9iPLgy3h33BQAwUJCTWc1hvzrcpvMxSNjTXnFf");

#[program]
pub mod sol1 {
    use super::*;
    
    const EXPECTED_AMOUNT: u64 = 1_000_000;
    const PROGRAM_AUTHORITY: &str = "B2nDe6bnnhEjS6a7AG7X2dY6eMVWXyzhTZKpZtwv7tfE"; 

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64, code: String) -> Result<()> {
        require!(amount == EXPECTED_AMOUNT, ErrorCode::InvalidAmount);

        let from_pubkey = ctx.accounts.signer.to_account_info();
        let to_pubkey = ctx.accounts.pda_account.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();
        
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"fixed_amount", &[bump_seed]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        ).with_signer(signer_seeds);

        transfer(cpi_context, amount)?;
        msg!("Transferred exactly {} lamports to PDA via program", amount);
        
        // Hash the provided code
        let data = format!("SOLANA TEST{}", code);
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        let hash_result = hasher.finalize();
        
        msg!("Transaction hash: {}", bs58::encode(hash_result).into_string());
        
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        require!(
            ctx.accounts.program_authority.key() == Pubkey::from_str(PROGRAM_AUTHORITY).unwrap(),
            ErrorCode::UnauthorizedWithdrawal
        );

        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();
        
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"fixed_amount", &[bump_seed]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        ).with_signer(signer_seeds);

        transfer(cpi_context, EXPECTED_AMOUNT)?;
        msg!("Withdrawn exactly {} lamports to recipient", EXPECTED_AMOUNT);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"fixed_amount"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub program_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"fixed_amount"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount - must transfer exactly 0.001 SOL")]
    InvalidAmount,
    #[msg("Unauthorized withdrawal attempt")]
    UnauthorizedWithdrawal,
}