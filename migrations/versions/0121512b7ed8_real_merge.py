"""real merge

Revision ID: 0121512b7ed8
Revises: 0f6bf823e331, 567e83386dc6, 866f095e4621, b46973c955d6
Create Date: 2025-05-27 02:46:25.114169

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0121512b7ed8'
down_revision = ('0f6bf823e331', '567e83386dc6', '866f095e4621', 'b46973c955d6')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
