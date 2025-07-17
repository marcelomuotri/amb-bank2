import React, { memo } from 'react';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: '12px 16px',
    border: '1px solid #ccc',
    borderRadius: 8,
    height: '48px',
    '&:hover': {
      border: '1px solid #999',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchField = memo<SearchFieldProps>(({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder || t('table.search');
      return (
      <StyledTextField
        placeholder={defaultPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#666', mr: 1 }} />
          ),
        }}
      />
    );
});

SearchField.displayName = 'SearchField';

export default SearchField; 