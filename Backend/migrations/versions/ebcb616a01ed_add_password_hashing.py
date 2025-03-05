"""Add password hashing

Revision ID: ebcb616a01ed
Revises: 0e47f5d297f6
Create Date: 2025-03-05 12:35:11.601190

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebcb616a01ed'
down_revision = '0e47f5d297f6'
branch_labels = None
depends_on = None


def upgrade():
    # ### Fix the missing constraint name ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint("uq_users_username", ['username'])  # ✅ Add a proper name

    # ### end Alembic commands ###


def downgrade():
    # ### Fix constraint name in downgrade ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint("uq_users_username", type_='unique')  # ✅ Use the correct name

    # ### end Alembic commands ###
