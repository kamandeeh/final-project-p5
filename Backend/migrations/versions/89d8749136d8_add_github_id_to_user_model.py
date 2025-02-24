"""Add github_id to User model

Revision ID: 89d8749136d8
Revises: a20a3f4e8ab1
Create Date: 2025-02-23 16:51:53.106152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '89d8749136d8'
down_revision = 'a20a3f4e8ab1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('github_id', sa.String(length=100), nullable=True))
        batch_op.create_unique_constraint("uq_user_github_id", ['github_id'])


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('github_id')

    # ### end Alembic commands ###
