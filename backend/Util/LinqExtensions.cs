﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Novatic.Util
{
    public static class LinqExtensions
    {
        public enum Order
        {
            Asc,
            Desc
        }

        public static IQueryable<T> OrderByDynamic<T>(
            this IQueryable<T> query,
            string orderByMember,
            Order direction)
        {
            var queryElementTypeParam = Expression.Parameter(typeof(T));

            var memberAccess = Expression.PropertyOrField(queryElementTypeParam, orderByMember);

            var keySelector = Expression.Lambda(memberAccess, queryElementTypeParam);

            var orderBy = Expression.Call(
                typeof(Queryable),
                direction == Order.Asc ? "OrderBy" : "OrderByDescending",
                new Type[] { typeof(T), memberAccess.Type },
                query.Expression,
                Expression.Quote(keySelector));

            return query.Provider.CreateQuery<T>(orderBy);
        }
    }
}
