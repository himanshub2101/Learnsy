from sqlalchemy.ext.asyncio import AsyncSession
from app.models.enrollment import Enrollment
from app.core.config import get_settings
import asyncio, logging

settings = get_settings()
log = logging.getLogger(__name__)

async def maybe_mint_certificate(enrollment: Enrollment, db: AsyncSession) -> None:
    """
    Mint NFT cert via Alchemy if:
    - course is completed
    - user.wallet_address exists
    - cert not already minted
    """
    from web3 import AsyncWeb3, HTTPProvider  # lazy import

    if not enrollment.user.wallet_address or enrollment.certificate_tx:
        return

    # --- Build minimal tx (stub) ---
    w3 = AsyncWeb3(HTTPProvider(settings.alchemy_rpc))
    contract = w3.eth.contract(address=settings.cert_contract, abi=settings.cert_abi)

    tx = contract.functions.mint(
        enrollment.user.wallet_address,
        enrollment.course_id
    )

    try:
        signed = await w3.eth.account.sign_transaction(
            tx.build_transaction({"nonce": await w3.eth.get_transaction_count(settings.backend_wallet)}),
            private_key=settings.backend_wallet_pk
        )
        tx_hash = await w3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = await w3.eth.wait_for_transaction_receipt(tx_hash)

        enrollment.certificate_tx = tx_hash.hex()
        enrollment.certificate_uri = f"{settings.cert_base_uri}/{enrollment.course_id}/{enrollment.user_id}"
        await db.commit()
    except Exception as exc:
        log.error("Certificate mint failed: %s", exc)
