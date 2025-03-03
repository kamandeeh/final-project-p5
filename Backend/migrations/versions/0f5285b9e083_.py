"""empty message

Revision ID: 0f5285b9e083
Revises: 
Create Date: 2025-02-28 19:54:56.073449

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f5285b9e083'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('counties',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('county', sa.String(length=255), nullable=False),
    sa.Column('category', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('token_blocklist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_token_blocklist_jti'), ['jti'], unique=False)

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('provider', sa.String(length=50), nullable=True),
    sa.Column('uid', sa.String(length=255), nullable=False),
    sa.Column('profile_completed', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('uid')
    )
    op.create_table('county_statistics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('county_id', sa.Integer(), nullable=False),
    sa.Column('poverty', sa.Integer(), nullable=False),
    sa.Column('employment', sa.Integer(), nullable=False),
    sa.Column('social_integration', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['county_id'], ['counties.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('profiles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=150), nullable=False),
    sa.Column('age', sa.Integer(), nullable=False),
    sa.Column('gender', sa.String(length=10), nullable=False),
    sa.Column('location', sa.String(length=100), nullable=False),
    sa.Column('social_background', sa.String(length=200), nullable=False),
    sa.Column('phone_number', sa.String(length=10), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(length=300), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('profiles')
    op.drop_table('county_statistics')
    op.drop_table('users')
    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_token_blocklist_jti'))

    op.drop_table('token_blocklist')
    op.drop_table('counties')
    # ### end Alembic commands ###
